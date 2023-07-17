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
import { createCompatibilityReport } from 'apiSdk/compatibility-reports';
import { Error } from 'components/error';
import { compatibilityReportValidationSchema } from 'validationSchema/compatibility-reports';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { CompatibilityReportInterface } from 'interfaces/compatibility-report';

function CompatibilityReportCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CompatibilityReportInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCompatibilityReport(values);
      resetForm();
      router.push('/compatibility-reports');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CompatibilityReportInterface>({
    initialValues: {
      report: '',
      user_id1: (router.query.user_id1 as string) ?? null,
      user_id2: (router.query.user_id2 as string) ?? null,
    },
    validationSchema: compatibilityReportValidationSchema,
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
            Create Compatibility Report
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="report" mb="4" isInvalid={!!formik.errors?.report}>
            <FormLabel>Report</FormLabel>
            <Input type="text" name="report" value={formik.values?.report} onChange={formik.handleChange} />
            {formik.errors.report && <FormErrorMessage>{formik.errors?.report}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id1'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id2'}
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
    entity: 'compatibility_report',
    operation: AccessOperationEnum.CREATE,
  }),
)(CompatibilityReportCreatePage);
