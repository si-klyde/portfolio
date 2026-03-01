-- comments table
create table comments (
  id uuid default gen_random_uuid() primary key,
  name text not null check (char_length(name) between 1 and 50),
  message text not null check (char_length(message) between 1 and 500),
  visible boolean default true,
  ip_hash text,
  created_at timestamptz default now()
);

create index idx_comments_created_at on comments (created_at desc);
create index idx_comments_ip_hash on comments (ip_hash, created_at desc);

-- RLS
alter table comments enable row level security;

-- anyone can read visible comments
create policy "public_read" on comments
  for select using (visible = true);

-- rate-limited insert: max 3 per IP per hour
create policy "rate_limited_insert" on comments
  for insert with check (
    (select count(*) from comments
     where ip_hash = encode(sha256((current_setting('request.headers', true)::json->>'x-forwarded-for')::bytea), 'hex')
       and created_at > now() - interval '1 hour'
    ) < 3
  );

-- no update/delete from anon
create policy "no_update" on comments for update using (false);
create policy "no_delete" on comments for delete using (false);

-- auto-set ip_hash on insert
create or replace function set_ip_hash()
returns trigger as $$
begin
  new.ip_hash := encode(
    sha256(coalesce(
      current_setting('request.headers', true)::json->>'x-forwarded-for',
      'unknown'
    )::bytea),
    'hex'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_set_ip_hash
  before insert on comments
  for each row execute function set_ip_hash();

-- heuristic spam filter
create or replace function check_spam()
returns trigger as $$
declare
  caps_ratio float;
  alpha_count int;
  combined text;
  repeat_count int;
  profanity text[] := array[
    'fuck','shit','ass','bitch','dick','cock','pussy','cunt',
    'faggot','fag','nigger','nigga','retard','whore','slut',
    'bastard','damn','piss','twat','wanker','kys','stfu'
  ];
  word text;
begin
  combined := lower(new.name || ' ' || new.message);

  -- profanity check (also catches leet: f*ck, sh1t, etc.)
  foreach word in array profanity loop
    if combined ~* word then
      new.visible := false;
      return new;
    end if;
  end loop;

  -- URLs
  if new.message ~* 'https?://' or new.message ~* 'www\.' then
    new.visible := false;
    return new;
  end if;

  -- excessive caps (>70% of alpha chars)
  alpha_count := length(regexp_replace(new.message, '[^a-zA-Z]', '', 'g'));
  if alpha_count > 5 then
    caps_ratio := length(regexp_replace(new.message, '[^A-Z]', '', 'g'))::float / alpha_count;
    if caps_ratio > 0.7 then
      new.visible := false;
      return new;
    end if;
  end if;

  -- repeated characters (e.g. aaaaaaa, !!!!!)
  repeat_count := length((regexp_match(new.message, '(.)\1{4,}'))[1]);
  if repeat_count is not null then
    new.visible := false;
    return new;
  end if;

  -- emoji spam (>50% non-ASCII in a message with 5+ chars)
  if length(new.message) > 5 then
    if length(regexp_replace(new.message, '[[:ascii:]]', '', 'g'))::float / length(new.message) > 0.5 then
      new.visible := false;
      return new;
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger trg_check_spam
  before insert on comments
  for each row execute function check_spam();
