def reverseStr(s: str, k: int) -> str:
    s = list(s)  # Convert to a list for in-place modification
    n = len(s)

    for i in range(0, n, 2 * k):  # Process every 2k chunk
        left, right = i, min(i + k - 1, n - 1)  # Reverse only first k characters
        while left < right:
            s[left], s[right] = s[right], s[left]  # Swap characters
            left += 1
            right -= 1

    return "".join(s)  # Convert list back to string

# Example usage:
print(reverseStr("abcdefg", 2))  # Output: "bacdfeg"
print(reverseStr("abcd", 2))     # Output: "bacd"