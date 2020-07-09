import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
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

        /*
            Check if is provider
        */
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

        /*
            Check for past dates
        */
        const hourStart = startOfHour(parseISO(date));

        if (isBefore(hourStart, new Date())) {
            return res
                .status(400)
                .json({ error: 'Past date is not permitted.' });
        }

        /*
            Check date availability
        */
        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart,
            },
        });

        if (checkAvailability) {
            return res
                .status(400)
                .json({ error: 'Appoitment date is not available' });
        }

        const appointment = await Appointment.create({
            user_id: req.userId,
            date: hourStart,
            provider_id,
        });

        return res.json(appointment);
    }
}

export default new AppointmentController();
