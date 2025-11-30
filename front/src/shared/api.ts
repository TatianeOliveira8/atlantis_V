export const API_CLIENTES = 'http://localhost:3001';
export const API_HOSPEDAGEM = 'http://localhost:3002';

export async function getClientes() {
    const response = await fetch(`${API_CLIENTES}/clientes`);
    if (!response.ok) throw new Error('Failed to fetch clientes');
    return response.json();
}

export async function getTitulares() {
    const response = await fetch(`${API_CLIENTES}/titulares`);
    if (!response.ok) throw new Error('Failed to fetch titulares');
    return response.json();
}

export async function getDependentes() {
    const response = await fetch(`${API_CLIENTES}/dependentes`);
    if (!response.ok) throw new Error('Failed to fetch dependentes');
    return response.json();
}

export async function addCliente(cliente: any) {
    const response = await fetch(`${API_CLIENTES}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
    });
    if (!response.ok) throw new Error('Failed to add cliente');
    return response.json();
}

export async function getAcomodacoes() {
    const response = await fetch(`${API_HOSPEDAGEM}/acomodacoes`);
    if (!response.ok) throw new Error('Failed to fetch acomodacoes');
    return response.json();
}

export async function addAcomodacao(acomodacao: any) {
    const response = await fetch(`${API_HOSPEDAGEM}/acomodacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(acomodacao)
    });
    if (!response.ok) throw new Error('Failed to add acomodacao');
    return response.json();
}

export async function getHospedagens() {
    const response = await fetch(`${API_HOSPEDAGEM}/hospedagens`);
    if (!response.ok) throw new Error('Failed to fetch hospedagens');
    return response.json();
}

export async function addHospedagem(hospedagem: any) {
    const response = await fetch(`${API_HOSPEDAGEM}/hospedagens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hospedagem)
    });
    if (!response.ok) throw new Error('Failed to add hospedagem');
    return response.json();
}

export async function updateCliente(cliente: any) {
    const response = await fetch(`${API_CLIENTES}/clientes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
    });
    if (!response.ok) throw new Error('Failed to update cliente');
    return response.json();
}

export async function deleteCliente(id: number) {
    const response = await fetch(`${API_CLIENTES}/clientes?id=${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete cliente');
    return response.json();
}

export async function deleteHospedagem(id: number) {
    const response = await fetch(`${API_HOSPEDAGEM}/hospedagens?id=${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete hospedagem');
    return response.json();
}
