export const calculatePoints = (questionType, timeSpent, timeLimit, usedHint = false) => {
  let basePoints = 0;
  
  // ১. বেস পয়েন্ট নির্ধারণ
  switch (questionType) {
    case 'MCQ': basePoints = 10; break;
    case 'SCRAMBLE': basePoints = 15; break;
    case 'WRITE': basePoints = 20; break;
    default: basePoints = 10;
  }

  // ২. টাইম বোনাস (সময় বাঁচালে অতিরিক্ত পয়েন্ট)
  let timeBonus = 0;
  if (timeSpent < timeLimit / 2) {
    timeBonus = basePoints * 0.5; // ৫০% বোনাস (দ্রুত উত্তরের জন্য)
  } else if (timeSpent < timeLimit * 0.75) {
    timeBonus = basePoints * 0.25; // ২৫% বোনাস
  }

  // ৩. হিন্ট পেনাল্টি (হিন্ট নিলে পয়েন্ট কাটা যাবে)
  let hintPenalty = usedHint ? 5 : 0;

  const totalEarned = Math.max(0, basePoints + timeBonus - hintPenalty);
  return Math.floor(totalEarned);
};