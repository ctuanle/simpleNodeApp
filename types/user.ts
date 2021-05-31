export interface BasicUser {
    username: string,
    password: string,
    email?: string
}
export interface User extends BasicUser {
    uid: string
}