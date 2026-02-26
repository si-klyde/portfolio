import blog from '../../../data/blog.json';

export default function BlogOutput() {
  return (
    <div>
      {blog.map((article, i) => (
        <div key={article.title} className="blog-entry">
          <div>
            <span className="blog-title">{article.title}</span>
            <span className="blog-date"> ({article.date})</span>
          </div>
          <div className="blog-excerpt">  {article.excerpt}</div>
          {i < blog.length - 1 && <div className="output-divider">---</div>}
        </div>
      ))}
    </div>
  );
}
