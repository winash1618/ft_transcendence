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
	PRIMARY: 'var(--main-600)',
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

export enum GNav  {
	GROUPS,
	BLOCKED,
	ADD,
};

export interface User {
	id: number;
	login: string;
	username: string;
	avatar: string;
	profile_picture: string;
}

export interface Participant {
	id: number;
	user: User;
	conversation_status: 'ACTIVE' | 'BANNED' | 'KICKED' | 'MUTED';
	role: 'OWNER' | 'ADMIN' | 'USER';
}
export interface Conversation {
	id: number;
	title: string;
	participants: Participant[];
	privacy: 'PRIVATE' | 'PROTECTED' | 'PUBLIC';
}