import * as yup from 'yup';

export const compatibilityReportValidationSchema = yup.object().shape({
  report: yup.string(),
  user_id1: yup.string().nullable(),
  user_id2: yup.string().nullable(),
});
