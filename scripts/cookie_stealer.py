# WIP script

# Close a browser session by copying CSV data of cookies from browser and writing it to another browser

import re
import json

def create_json_from_file(input_filename='y.txt', output_filename='cookies.json'):
    """
    Reads a text file, parses each line into a key-value pair,
    and writes the result to a JSON file.

    Args:
        input_filename (str): The name of the file to read from.
        output_filename (str): The name of the JSON file to create.
    """
    data_dict = {}

    try:
        # Open the input file for reading
        with open(input_filename, 'r') as file:
            for line in file:
                # Remove leading/trailing whitespace from the line
                clean_line = line.strip()

                # If the line is not empty, process it
                if clean_line:
                    # Split the line by one or more spaces, but only the first occurrence
                    parts = re.split(r'\s+', clean_line, maxsplit=10)

                    # Check if the split resulted in a key and a value
                    if len(parts) >= 2:
                        key = parts[0]
                        value = parts[1]
                        data_dict[key] = value
                    else:
                        print(f"Warning: Skipping malformed line -> '{clean_line}'")

        # Open the output file for writing
        with open(output_filename, 'w') as json_file:
            # Dump the dictionary to the JSON file with an indent for readability
            json.dump(data_dict, json_file, indent=4)

        print(f"Successfully converted '{input_filename}' to '{output_filename}'")

    except FileNotFoundError:
        print(f"Error: The file '{input_filename}' was not found.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# --- Main execution ---
if __name__ == "__main__":
    # The script will read from 'y.txt' and write to 'cookies.json' by default
    create_json_from_file()
