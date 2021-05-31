export interface BasicProduct {
    name: string,
    price: number,
    category: string,
    images?: string
}

export interface Product extends BasicProduct {
    id: number
}