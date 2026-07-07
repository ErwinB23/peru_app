import multer from "multer";
import path from "path";
import fs from "fs";

const createUploadPath = (folderName) => {
    const uploadPath = path.join(process.cwd(), "uploads", folderName);

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    return uploadPath;
};

const createStorage = (folderName) => {
    const uploadPath = createUploadPath(folderName);

    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath);
        },

        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname).toLowerCase();

            const cleanName = path
                .basename(file.originalname, extension)
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9]/g, "-")
                .replace(/-+/g, "-")
                .toLowerCase();

            cb(null, `${Date.now()}-${cleanName}${extension}`);
        },
    });
};

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten imágenes JPG, JPEG, PNG o WEBP"), false);
    }
};

const createImageUpload = (folderName) => {
    return multer({
        storage: createStorage(folderName),
        fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    });
};

export const uploadDepartamentoImage = createImageUpload("departamentos");
export const uploadLugarTuristicoImage = createImageUpload("lugares-turisticos");
export const uploadComidaTipicaImage = createImageUpload("comidas-tipicas");

export const uploadProvinciaImage = createImageUpload('provincias');
export const uploadLugarTuristicoProvinciaImage = createImageUpload('lugares-turisticos-provincias');
export const uploadComidaTipicaProvinciaImage = createImageUpload('comidas-tipicas-provincias');


export const uploadDistritoImage = createImageUpload('distritos');
export const uploadLugarTuristicoDistritoImage = createImageUpload('lugares-turisticos-distritos');
export const uploadComidaTipicaDistritoImage = createImageUpload('comidas-tipicas-distritos');

export const uploadCiudadImage = createImageUpload('ciudades');
export const uploadLugarTuristicoCiudadImage = createImageUpload('lugares-turisticos-ciudades');
export const uploadComidaTipicaCiudadImage = createImageUpload('comidas-tipicas-ciudades');
