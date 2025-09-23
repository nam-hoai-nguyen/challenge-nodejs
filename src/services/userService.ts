import UserModel from "../infrastructure/db/sequelize/models/UserModel";

interface GetAllUsersParams {
    pageNo?: number;     // Trang hiện tại (>=1)
    pageSize?: number;   // Số dòng mỗi trang
}

export const getAllUsersService = async ({ pageNo = 1, pageSize = 10 }: GetAllUsersParams) => {
    // Chuẩn hóa giá trị
    const page = pageNo < 1 ? 1 : pageNo;
    const limit = pageSize > 100 ? 100 : pageSize; // giới hạn tối đa 100 (tùy chỉnh)
    const offset = (page - 1) * limit;

    const { rows, count } = await UserModel.findAndCountAll({
        offset,
        limit,
        order: [["createdAt", "DESC"]],
        attributes: { exclude: ["password"] }
    });

    const totalItems = count;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
        data: rows,
        meta: {
            page,
            pageSize: limit,
            totalItems,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
};
export const createUserService = async (data: any) => {
    // Ví dụ: check email trùng
    const exists = await UserModel.findOne({ where: { email: data.email } });
    if (exists) throw new Error("Email đã tồn tại");
    return await UserModel.create(data);
};
