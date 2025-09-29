export interface UserProps {
  id?: number;
  email: string;
  name: string;
  role?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private props: UserProps;

  private constructor(props: UserProps) {
    this.props = props;
  }

  // Tạo mới entity
  static create(input: {
    id?: number;
    email: string;
    name: string;
    role?: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    const now = new Date();
    return new User({
      id: input.id,
      email: input.email,
      name: input.name,
      role: input.role ?? 'employee',
      password: input.password,
      createdAt: input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now,
    });
  }

  // Tái tạo entity từ DB
  static rehydrate(props: UserProps) {
    return new User(props);
  }

  // Trả về dữ liệu thô
  toObject(): UserProps {
    return { ...this.props };
  }

  get id() {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  get password(): string {
    return this.props.password;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get role() {
    return this.props.role;
  }
}
