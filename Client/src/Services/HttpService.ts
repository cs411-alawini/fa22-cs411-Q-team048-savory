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

export async function UPDATE<T>(url: string, desc: string) {
    try {
        const apiResult = await axios.get<T>(url,
        {
            headers: {
              Accept: 'application/json',
            },
            data: {
                new_description: desc
            }
        },
        );
        return apiResult.data as T;
    }
    catch(e)
    {
        console.log(e);
    }
}
export async function SEARCH<T>(url: string, key: string) {
    try {
        const apiResult = await axios.get<T>(url,
        {
            headers: {
              Accept: 'application/json',
            },
            data: {
                search_key: key
            }
        },
        );
        return apiResult.data as T;
    }
    catch(e)
    {
        console.log(e);
    }
}