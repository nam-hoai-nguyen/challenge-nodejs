export interface UserProps {
  email: string;
  name: string;
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
  static create(input: { email: string; name: string; password: string }) {
    const now = new Date();
    return new User({
      email: input.email,
      name: input.name,
      password: input.password,
      createdAt: now,
      updatedAt: now,
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

  // --- GETTERS ---
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
}
