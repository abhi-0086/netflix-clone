import { PrismaClient } from "@prisma/client";

const Client = global.prismadb || new PrismaClient();
if(process.env.NODE_ENV === "production") global.prismadb = Client;

export default Client;