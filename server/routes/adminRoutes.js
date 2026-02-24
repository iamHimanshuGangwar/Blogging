import express from 'express'
import { adminLogin, approvedCommentById, getAllBlogsAdmin, getDashboard } from '../controllers/adminlogin.js';
import { getAllComments,deleteCommentById } from '../controllers/adminlogin.js';
import auth from '../middlewares/auth.js';
import { verifyTransporter } from '../utils/sendMail.js';

const adminRouter=express.Router();
adminRouter.post('/login',adminLogin);
adminRouter.get('/comment', auth,getAllComments)
adminRouter.get('/blogs',auth,getAllBlogsAdmin)
adminRouter.post('/delete-comment',auth,deleteCommentById)
adminRouter.post('/approve-comment',auth,approvedCommentById)
adminRouter.get('/dashboard',auth,getDashboard)
// Diagnostic route to verify SMTP transporter (returns OK or error message)
adminRouter.get('/test-mail', async (req, res) => {
	try {
		const result = await verifyTransporter();
		if (result.ok) return res.status(200).json({ success: true, message: 'Mail transporter verified' });
		return res.status(500).json({ success: false, message: 'Transporter verification failed', error: result.error });
	} catch (err) {
		return res.status(500).json({ success: false, message: err.message || String(err) });
	}
});
export default adminRouter;
