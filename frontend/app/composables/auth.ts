
export function useAuth() {
  
  const router = useRouter();
  const user = useState<User | null>("auth", () => null);
  const config = useRuntimeConfig();
  const fetch = useRequestFetch();

  function setUser(u: User) {
    user.value = u;
  }

  async function getMe() {
    try {
      const res: User = await fetch(`${config.public.api}/auth/me`, {
        credentials: "include",
      });
      // console.log(res)
      if (res && res.id) {
        setUser(res);
        router.push("/"); // redirect หลัง login
      }
    } catch (err) {
      console.log("getPayload error:", err);
      // navigateTo("/login");
      router.push("/login");
    }
  }

  // login ผ่าน API
  async function login(input: { username: string; password: string }) {
    try {
      console.log(config.public.api);
      // เรียก API login
      const res = await fetch(`${config.public.api}/auth/login`, {
        method: "POST",
        body: {
          username: input.username,
          password: input.password,
        },
        credentials: "include",
      });

      // สมมติ API คืนค่า { id, name, role }
      if (res && res.id) {
        setUser(res);
        router.push("/"); // redirect หลัง login
      }
    } catch (err: any) {
      const errorMsg = err.data?.msg || err.message || "Something went wrong";
      console.error("Login Error:", errorMsg);
      alert("Login failed: " + errorMsg);


    }

  }

  // logout
  async function logout() {
    try {
      // เรียก API login
      const res = await fetch(`${config.public.api}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      user.value = null;
      router.push("/login");
    } catch (err: any) {
      console.error(err?.data);
      alert("Logout failed");
    }
  }

  return { user, setUser, login, logout, getMe };
}