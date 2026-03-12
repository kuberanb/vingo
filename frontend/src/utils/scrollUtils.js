
// utils/scrollUtils.js
export const scrollLeft = (scrollRef, amount = 200) => {
  if (scrollRef.current) {
    scrollRef.current.scrollBy({ left: -amount, behavior: "smooth" });
  }
};

export const scrollRight = (scrollRef, amount = 200) => {
  if (scrollRef.current) {
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  }
};

export const checkScroll = (scrollRef, setLeft, setRight) => {
  const el = scrollRef.current;
  if (el) {
    setLeft(el.scrollLeft > 0);
    setRight(el.scrollLeft < el.scrollWidth - el.clientWidth);
  }
};