export interface BasicProduct {
    id: number,
}

export interface Product extends BasicProduct {
    name: string,
    price: number,
    category: string,
}