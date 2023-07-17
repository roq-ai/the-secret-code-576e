import * as yup from 'yup';

export const numerologyReportValidationSchema = yup.object().shape({
  partial_report: yup.string(),
  full_report: yup.string(),
  user_id: yup.string().nullable(),
});
