
export const environment = {
    PATH: "https://api.airtable.com/v0",
    AUTH: "Bearer key2CwkHb0CKumjuM",
    KEY: "appRNtYLglpPhv2QD",
    USER: "1405",
  };
  
  const url = `${environment.PATH}/${environment.KEY}/Historico`;
  const headers = new Headers({
    Authorization: environment.AUTH,
    "Content-Type": "application/json",
  });
  
  async function get() {
    return await fetch(`${url}?filterByFormula=Responsavel=${environment.USER}`, {
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => data)
      .catch((e) => console.log(e));
  }
  
  function post(params) {
    return fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((data) => data)
      .catch((e) => console.log(e));
  }
  
  function patch(params, id) {
    return fetch(`${url}/${id}`, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((data) => data)
      .catch((e) => console.log(e));
  }
  
  function del(id) {
    return fetch(`${url}/${id}`, {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => data)
      .catch((e) => console.log(e));
  }
  
  
  
  let params = {
    fields: {
       Responsavel: "1405",
       Json: JSON.stringify({ type, name, value }),
    },
  };
  
  //this._transactions.list() // {type, name, value}
  //this._transactions.list() // [ {type, name, value},  {type, name, value}]
  
  let id = null
  get()
    .then(({ records }) => {
      id = records[0]?.id;
    })