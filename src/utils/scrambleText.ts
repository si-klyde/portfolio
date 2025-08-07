export function scrambleText(selector: string, finalText: string, delay = 600) {
  const element = document.querySelector(selector);
  if (!element) return;
  
  const currentText = element.textContent || '';
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let frame = 0;
  const maxFrames = 35;
  
  setTimeout(() => {
    const scrambleInterval = setInterval(() => {
      let scrambled = "";
      const progress = frame / maxFrames;
      
      // Handle shrinking text (from long to short)
      if (finalText.length < currentText.length) {
        const currentLength = Math.floor(currentText.length - ((currentText.length - finalText.length) * Math.min(progress * 1.2, 1)));
        
        for (let i = 0; i < currentLength; i++) {
          const charResolvePoint = (i * 2) + 3;
          
          if (frame > charResolvePoint) {
            scrambled += finalText[i] || "";
          } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          }
        }
      } else {
        // Handle growing text (from short to long)
        const currentLength = Math.floor(currentText.length + ((finalText.length - currentText.length) * Math.min(progress * 1.5, 1)));
        
        for (let i = 0; i < currentLength; i++) {
          const charResolvePoint = (i * 2) + 3;
          
          if (frame > charResolvePoint) {
            scrambled += finalText[i] || "";
          } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          }
        }
      }
      
      element.textContent = scrambled;
      frame++;
      
      if (frame > maxFrames) {
        clearInterval(scrambleInterval);
        element.textContent = finalText;
      }
    }, 50);
  }, delay);
}