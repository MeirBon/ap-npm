export default interface AuthProvider {
    userLogin(username: string, password: string, email?: string): Promise<boolean>;

    userAdd(username: string, password: string, email: string): Promise<boolean>;

    userRemove(username: string, password: string): Promise<boolean>;
}