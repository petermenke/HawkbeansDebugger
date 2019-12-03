public class FibonacciIter {
    public static void main(String[] args) {
        
        int previouspreviousNumber, previousNumber = 0, currentNumber = 1;

        for (int i = 1; i <= 5 ; i++) {
            previouspreviousNumber = previousNumber;
            previousNumber = currentNumber;
            currentNumber = previouspreviousNumber + previousNumber;
        }
        int answer = currentNumber;
    }
}