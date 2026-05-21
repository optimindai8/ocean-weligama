import { Router, type IRouter } from "express";
import healthRouter from "./health";
import roomsRouter from "./rooms";
import servicesRouter from "./services";
import bookingsRouter from "./bookings";
import reviewsRouter from "./reviews";
import galleryRouter from "./gallery";
import contactRouter from "./contact";
import adminAuthRouter from "./admin-auth";
import adminBookingsRouter from "./admin-bookings";
import adminRoomsRouter from "./admin-rooms";
import adminAnalyticsRouter from "./admin-analytics";
import adminMiscRouter from "./admin-misc";
import adminGalleryRouter from "./admin-gallery";
import blogsRouter from "./blogs";
import adminBlogsRouter from "./admin-blogs";

const router: IRouter = Router();

router.use(healthRouter);
router.use(roomsRouter);
router.use(servicesRouter);
router.use(bookingsRouter);
router.use(reviewsRouter);
router.use(galleryRouter);
router.use(contactRouter);
router.use(adminAuthRouter);
router.use(adminBookingsRouter);
router.use(adminRoomsRouter);
router.use(adminAnalyticsRouter);
router.use(adminMiscRouter);
router.use(adminGalleryRouter);
router.use(blogsRouter);
router.use(adminBlogsRouter);

export default router;
