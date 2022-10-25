import axios from 'axios'

export interface CatData {
    fact: string;
    length: number;
}
export async function GET<T>(url: string) {
    try {
        const apiResult = await axios.get<T>(url,
        {
            headers: {
              Accept: 'application/json',
            },
        },
        );
        return apiResult.data as T;
    }
    catch(e)
    {
        console.log(e);
    }
}