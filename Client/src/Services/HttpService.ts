import axios from 'axios'
import { json } from 'stream/consumers';
import { parseIsolatedEntityName } from 'typescript';
import Auth from '../Components/Auth/Auth';

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