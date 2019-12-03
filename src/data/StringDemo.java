public class StringDemo {
    public static String str = "Hello World!";
    
    public static void main(String[] args) {
        int total = 0;

        // Convert to lowercase
        str = str.toLowerCase();

        // Count the number of lowercase l's
        for (int i = 0; i < str.length(); i++) {
            int c = str.charAt(0);
            if (c == 'l')
                total++;
        }
    }
}