interface TopographyData {
  width: number;
  height: number;
  values: number[];
  min: number;
  max: number;
}

export async function getData(url: string): Promise<TopographyData> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return error.message;
  }
}