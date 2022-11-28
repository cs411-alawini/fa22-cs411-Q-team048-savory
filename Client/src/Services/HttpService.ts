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
        const apiResult = await axios.post<T>(url,
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
        const apiResult = await axios.post<T>(url,
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

export async function DELETE<T>(url: string) {
    try {
        const apiResult = await axios.post<T>(url,
        {
            headers: {
              Accept: 'application/json',
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

export async function SUBMIT<T>(url: string, uid: string, qid: number, query: string) {
    try {
        const apiResult = await axios.post<T>(url,
        {
            headers: {
              Accept: 'application/json',
            },
            data: {
                Query: query,
                Qid: qid,
                Uid: uid
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

export async function INTERMEDIATE<T>(url: string, query: string) {
    try {
        const apiResult = await axios.post<T>(url,
        {
            headers: {
              Accept: 'application/json',
            },
            data: {
                query: query
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

export async function Login<T>(userName:string, password:string){
    
    const url = "http://localhost:8081/auth";
    try{
        const apiResult = await axios.post<T>(url,
            {
                headers: {
                  Accept: 'application/json',
                },
                data: {
                    userName: userName,
                    password: password
                }
            },
            );
            return apiResult.data as T;
    }
    catch(e)
    {
        console.log(e);
        return false;
    }
}