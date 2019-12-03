public class FibonacciRec {
    public static void main(String[] args) {
        int result = fibRec(5);
    }

    public static int fibRec(int n) {
        if (n == 0 || n == 1)
            return n;
        return fibRec(n-1) + fibRec(n-2);
    }
}