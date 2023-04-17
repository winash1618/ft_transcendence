export const Status = {
	ACTIVE: 'ACTIVE',
	BANNED: 'BANNED',
	KICKED: 'KICKED',
	MUTED: 'MUTED',
};

export enum Nav {
	DIRECT,
	GROUPS,
	EXPLORE,
	CREATE,
}

export const Colors = {
	PRIMARY: '#1A1D1F',
	SECONDARY: '#00A551',
	WHITE: '#FFFFFF',
}

export const Privacy = {
	PUBLIC: 'PUBLIC',
	PRIVATE: 'PRIVATE',
	PROTECTED: 'PROTECTED',
	DIRECT: 'DIRECT'
};

export const Role = {
	OWNER: 'OWNER',
	ADMIN: 'ADMIN',
	USER: 'USER',
};

export const GNav = {
	GROUPS: 'GROUPS',
	BLOCKED: 'BLOCKED',
	ADD: 'ADD',
};

export interface User {
	id: number;
	username: string;
	avatar: string;
}

export interface Participant {
	id: number;
	user: User;
	role: 'OWNER' | 'ADMIN' | 'USER';
}
export interface Conversation {
	id: number;
	title: string;
	participants: Participant[];
	privacy: 'PRIVATE' | 'PROTECTED' | 'PUBLIC';
}