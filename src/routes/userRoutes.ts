// // src/routes/userRoutes.ts
// import { Router } from "express";
// import {
//     getAllUsers,
//     getUserById,
//     createUser,
//     updateUser,
//     deleteUser,
// } from "../controllers.bk/userController";
// import { createUserSchema } from "../validators/userValidator";
// import { createUserValidator, updateUserValidator } from "../validators/userValidator";
// import { validate } from "../middlewares.bk/validate";
// import { authMiddleware } from "../middlewares.bk/auth";
//
//
// const router = Router();
// router.use(authMiddleware);
// router.get("/", getAllUsers); // chỉ user có token mới xem được
// router.get("/:id", getUserById);
// // router.post("/", validate(createUserSchema), createUser);
// router.put("/:id", updateUser);
// router.delete("/:id", deleteUser);
//
// export default router;