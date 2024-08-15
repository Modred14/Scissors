import React from "react";

interface TruncatedWordProps {
  word?: string;
  maxLength: number;
}

const TruncatedWord: React.FC<TruncatedWordProps> = ({
  word = "",
  maxLength,
}) => {
  const truncateWord = (word: string, maxLength: number): string => {
    if (word.length > maxLength) {
      return word.substring(0, maxLength) + "...";
    } else {
      return word;
    }
  };

  return <span className="block">{truncateWord(word, maxLength)}</span>;
};

export default TruncatedWord;
