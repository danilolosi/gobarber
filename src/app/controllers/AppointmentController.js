import * as Yup from 'yup';
import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
    async store(req, res) {
        const schema = Yup.object().shape({
            date: Yup.date().required(),
            provider_id: Yup.number().required(),
        });

        if (!(await schema.isValid)) {
            return res.status(400).json({ error: 'Validations fail' });
        }

        const { provider_id, date } = req.body;

        const isProvider = await User.findOne({
            where: {
                id: provider_id,
                provider: true,
            },
        });

        if (!isProvider) {
            return res.status(401).json({
                error: 'You can only create appointments with provider',
            });
        }

        const appointment = await Appointment.create({
            user_id: req.userId,
            date,
            provider_id,
        });

        return res.json(appointment);
    }
}

export default new AppointmentController();
