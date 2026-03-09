export type TRegisterCredintials = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};
export type TLoginCredintials = {
	email: string;
	password: string;
};

export interface IUser {
	id: string;
	name: string;
	email: string;
}
