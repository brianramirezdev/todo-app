import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Extender la interfaz Request
interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No autorizado, token requerido' });
    }

    try {
        // 2. Verificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        // 3. Continuar
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token no válido' });
    }
};
