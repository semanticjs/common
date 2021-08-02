export class HTTPClient {
    public Delete(url: string, headers: {} = {}): Promise<Response>
    {
        return fetch(url, {
            method: 'DELETE',
            headers: {
                ...headers
            }
        });
    }
    
    public File(url: string, file: File, fileFormDataKey: string = 'file', data: { [prop: string]: any } = {}, 
        method: string = 'PUT', headers: {} = {}): Promise<Response>
    {
        const formData = new FormData();

        for (const prop in data) {
            formData.append(prop, data[prop]);
        }

        formData.append(fileFormDataKey, file);

        return fetch(url, {
            method: method,
            headers: {
                ...headers
            },
            body: formData
        });
    }
    
    public Get(url: string, headers: {} = {}): Promise<Response>
    {
        return fetch(url, {
            method: 'GET',
            headers: {
                ...headers
            }
        });
    }
    
    public Head(url: string, headers: {} = {}): Promise<Response>
    {
        return fetch(url, {
            method: 'HEAD',
            headers: {
                ...headers
            }
        });
    }
    
    public Post(url: string, data: {}, headers: {} = {}): Promise<Response>
    {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(data)
        });
    }
    
    public Put(url: string, data: {}, headers: {} = {}): Promise<Response>
    {
        return fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(data)
        });
    }
}