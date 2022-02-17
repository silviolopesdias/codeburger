import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import Logo from '../../assets/logo.svg'
import RegisterImg from '../../assets/registerImg.svg'
import Button from '../../components/Button'
import api from '../../services/api'
import {
  Container,
  RegisterImage,
  ContainerItens,
  Label,
  Input,
  SignInLink,
  Error
} from './styles'

function Register() {
  const schema = Yup.object().shape({
    name: Yup.string().required('O nome é obrigatório'),
    email: Yup.string()
      .email('Digite um e-mail válido')
      .required('O e-mail é obrigatório'),
    password: Yup.string()
      .required('A senha é obrigatória')
      .min(6, 'A senha deve ter no minimo 6 digitos'),
    confirmPassword: Yup.string()
      .required('A senha é obrigatória')
      .oneOf([Yup.ref('password')], 'As senhas devem ser iguais')
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async clientData => {
    try {
      const { status } = await api.post(
        'users',
        {
          name: clientData.name,
          email: clientData.email,
          password: clientData.password
        },
        { validateStatus: () => true }
      )

      if (status === 200 || status === 201) {
        toast.success('Cadastro criado com sucesso')
      } else if (status === 409) {
        toast.error('E-mail já cadastrado! faça login para continuar')
      } else {
        throw new Error()
      }
    } catch (err) {
      toast.error('Falha no sistema! tente novamente')
    }
  }

  return (
    <Container>
      <RegisterImage src={RegisterImg} alt="register-image" />

      <ContainerItens>
        <img src={Logo} alt="logo" />
        <h1>Cadastre-se</h1>

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Label error={errors.name?.message}>Name</Label>
          <Input
            type="text"
            {...register('name')}
            error={errors.name?.message}
          />
          <Error>{errors.name?.message}</Error>

          <Label error={errors.email?.message}>Email</Label>
          <Input
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Error>{errors.email?.message}</Error>

          <Label error={errors.password?.message}>Password</Label>
          <Input
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />
          <Error>{errors.password?.message}</Error>

          <Label error={errors.confirmPassword?.message}>
            Confirm Password
          </Label>
          <Input
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          <Error>{errors.confirmPassword?.message}</Error>

          <Button type="submit" style={{ marginTop: 25 }}>
            Sign Up
          </Button>
        </form>
        <SignInLink>
          Já possui conta?{' '}
          <Link style={{ color: 'white' }} to="/login">
            Sign In
          </Link>
        </SignInLink>
      </ContainerItens>
    </Container>
  )
}
export default Register
