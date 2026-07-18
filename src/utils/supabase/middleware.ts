import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Esto refresca la sesión si ha expirado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  
  // Evitar bucles redirigiendo archivos estáticos y API routes internas
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return supabaseResponse
  }

  const isAuthPage = 
    url.pathname.startsWith('/login') || 
    url.pathname.startsWith('/register') || 
    url.pathname.startsWith('/forgot-password')

  if (!user && !isAuthPage) {
    // Redirigir a login si no hay sesión activa y no está en una página de autenticación
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    // Si ya está logueado e intenta ir a login/registro, redirigir a perfil
    url.pathname = '/perfil'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
