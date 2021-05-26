export interface BasicUser {
    username: string,
    password: string
}
export interface User extends BasicUser {
    uid: string
}