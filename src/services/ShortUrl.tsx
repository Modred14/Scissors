const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

export const randomString = generateRandomString(7);

export const shortenUrl = async (longUrl: string): Promise<string> => {
  const shortenedLink = `https://app-scissors-api.onrender.com/s/${randomString}`;

  const response = await fetch(
    "https://app-scissors-api.onrender.com/api/urls/shorten",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ longUrl, shortUrl: randomString }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to shorten URL");
  }

  return shortenedLink;
};
