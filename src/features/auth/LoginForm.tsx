import React, {useContext} from "react";
import {observer} from "mobx-react-lite";
import {Box, Center, FormControl, FormLabel, Input, FormErrorMessage, Button} from "@chakra-ui/react";
import {Formik} from "formik";
import * as yup from "yup";
import {Link} from "react-router-dom";
import storeContext from "../../application/store/store";
import {IAuthFormValues} from "../../infrastructure/models/auth";
import {history} from "../../index";

const LoginForm = () => {
  const validationSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Please put in a valid email address"),
    password: yup.string().required("Password is required")
  })

  const {loginUser} = useContext(storeContext);

  return (
    <div className="auth__box">
        <Box className="middle">
          <Center mb={5}>
        <h1 className="logo__text">Heimdall Library</h1>
          </Center>
          <Box className="auth__form__box" bg="#fff">
            <Formik validationSchema={validationSchema} initialValues={{email: "", password: ""}} onSubmit={(values: IAuthFormValues, action) => loginUser(values).then(() => history.push("/")).catch(() => action.setSubmitting(false))}>
              {({
                handleSubmit,
                values,
                handleChange,
                handleBlur,
                isSubmitting,
                isValid,
                dirty,
                touched,
                errors
                }) => (
                <form onSubmit={handleSubmit}>
                  <header>
                  <Center>
                    <h1 className="auth__header">Login to your account</h1>
                  </Center>
                  <Center>
                    <p className="auth__desc">Securley login to your heimdall account</p>
                  </Center>
                  </header>

                  <Box mt={5}>
                  <FormControl isInvalid={!!errors.email && touched.email} id="email">
                    <FormLabel className="auth__label">Email address</FormLabel>
                    <Input value={values.email} name="email" onBlur={handleBlur} onChange={handleChange} className="auth__input" type="email" />
                    {errors.email && touched.email && <FormErrorMessage>
                      {errors.email}
                    </FormErrorMessage>}
                  </FormControl>

                    <FormControl isInvalid={!!errors.password && touched.password} mt={5} id="password">
                      <FormLabel className="auth__label">Password</FormLabel>
                      <Input value={values.password} name="password" onBlur={handleBlur} onChange={handleChange} className="auth__input" type="password" />
                      {errors.password && touched.password && <FormErrorMessage>
                        {errors.password}
                      </FormErrorMessage>}
                    </FormControl>
                  </Box>

                  <Button disabled={isSubmitting || !isValid || !dirty} type="submit" isLoading={isSubmitting} mt={10} className="auth__btn">
                      Log In
                  </Button>
                </form>
              )}
            </Formik>
          </Box>
          <Center mt={5}>
            <p style={{color: "#fff", fontSize: ".75em"}}>Dont have an account yet? <Link to="/signup">Sign up</Link></p>
          </Center>
        </Box>
    </div>
  )
}

export default observer(LoginForm);
