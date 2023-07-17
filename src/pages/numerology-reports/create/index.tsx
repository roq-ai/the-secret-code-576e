import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createNumerologyReport } from 'apiSdk/numerology-reports';
import { Error } from 'components/error';
import { numerologyReportValidationSchema } from 'validationSchema/numerology-reports';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { NumerologyReportInterface } from 'interfaces/numerology-report';

function NumerologyReportCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: NumerologyReportInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createNumerologyReport(values);
      resetForm();
      router.push('/numerology-reports');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<NumerologyReportInterface>({
    initialValues: {
      partial_report: '',
      full_report: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: numerologyReportValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Numerology Report
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="partial_report" mb="4" isInvalid={!!formik.errors?.partial_report}>
            <FormLabel>Partial Report</FormLabel>
            <Input
              type="text"
              name="partial_report"
              value={formik.values?.partial_report}
              onChange={formik.handleChange}
            />
            {formik.errors.partial_report && <FormErrorMessage>{formik.errors?.partial_report}</FormErrorMessage>}
          </FormControl>
          <FormControl id="full_report" mb="4" isInvalid={!!formik.errors?.full_report}>
            <FormLabel>Full Report</FormLabel>
            <Input type="text" name="full_report" value={formik.values?.full_report} onChange={formik.handleChange} />
            {formik.errors.full_report && <FormErrorMessage>{formik.errors?.full_report}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'numerology_report',
    operation: AccessOperationEnum.CREATE,
  }),
)(NumerologyReportCreatePage);
