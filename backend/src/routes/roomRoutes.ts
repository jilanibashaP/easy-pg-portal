import express from 'express';
import * as roomController from '../controllers/roomController';
const router = express.Router();

router.get('/', roomController.getAllRooms);
router.post('/', roomController.createRoom);
router.get('/:id', roomController.getRoomById);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);
// get the tenants based on the room name
router.get('/roomTenants/:roomName', roomController.getTenantsByRoomName);

export default router;