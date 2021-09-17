export function Delete(url: string, headers: {} = {}): Promise<Response> {
  return fetch(url, {
    method: 'DELETE',
    headers: {
      ...headers,
    },
  });
}

export function File(
  url: string,
  files: FileList,
  fileFormDataKey: string = 'file',
  data: { [prop: string]: any } = {},
  method: string = 'PUT',
  headers: {} = {}
): Promise<Response> {
  const formData = new FormData();

  for (const prop in data) {
    formData.append(prop, data[prop]);
  }

  for (const file of files) {
    formData.append(fileFormDataKey, file);
  }

  return fetch(url, {
    method: method,
    headers: {
      ...headers,
    },
    body: formData,
  });
}

export function Get(url: string, headers: {} = {}): Promise<Response> {
  return fetch(url, {
    method: 'GET',
    headers: {
      ...headers,
    },
  });
}

export function Head(url: string, headers: {} = {}): Promise<Response> {
  return fetch(url, {
    method: 'HEAD',
    headers: {
      ...headers,
    },
  });
}

export function Post(
  url: string,
  data: {},
  headers: {} = {}
): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  });
}

export function Put(
  url: string,
  data: {},
  headers: {} = {}
): Promise<Response> {
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  });
}
