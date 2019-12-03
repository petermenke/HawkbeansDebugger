public class MathDemo {
    static int x = 5;
    static int y = 100;
    
    public static void main(String[] args) {
        y = foo(x, 1, 200);
    }

    public static int foo(int a, int b, int c) {

        for (int i = 0; i < 3; i++) {
            a *= 2;
            b += 10;
        }

        return a + b;
    }
}