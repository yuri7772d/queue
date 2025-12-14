export function useAuth() {
  const router = useRouter();
  const user = useState("auth", () => null);
  const config = useRuntimeConfig();
  const fetch = useRequestFetch();

  function setUser(id, name, role) {
    user.value = { id, name, role };
  }

  async function getMe() {
    try {
      const res = await fetch(`${config.public.api}/auth/me`, {
        credentials: "include",
      });
     // console.log(res)
      if (res && res.id) {
        setUser(res.id, res.username, res.role);
        router.push("/"); // redirect หลัง login
      }
    } catch (err) {
      console.log("getPayload error:", err);
    }
  }

  // login ผ่าน API
  async function login(input) {
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
        setUser(res.id, res.username, res.role);
        router.push("/"); // redirect หลัง login
      }
    } catch (err) {
      console.error(err?.data?.msg);
      alert("Login failed: ",err?.data?.msg);
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
    } catch (err) {
      console.error(err?.data);
      alert("Logout failed");
    }
  }

  return { user, setUser, login, logout, getMe };
}