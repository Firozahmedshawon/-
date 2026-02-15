// সেকেন্ডকে MM:SS ফরম্যাটে রূপান্তর
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// টেক্সট ট্রানকেট (অতিরিক্ত বড় নাম ছোট করা)
export const truncateText = (text, length = 15) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};