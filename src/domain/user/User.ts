export interface UserProps {
    id: string;
    email: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: Date;
    updatedAt: Date;
}

export class User {
    private props: UserProps;

    private constructor(props: UserProps) {
        this.props = props;
    }

    static create(input: { id: string; email: string; name: string }) {
        const now = new Date();
        return new User({
            id: input.id,
            email: input.email,
            name: input.name,
            status: 'ACTIVE',
            createdAt: now,
            updatedAt: now
        });
    }

    static rehydrate(props: UserProps) {
        return new User(props);
    }

    toObject(): UserProps {
        return { ...this.props };
    }
}