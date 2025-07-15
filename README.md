# **Functionality has been moved to [Jellyfin-Enhanced](https://github.com/n00bcodr/Jellyfin-Enhanced)**

```
                  _     ____    ____  _   _  ___ __     __ _____  ____
                 / \   |  _ \  / ___|| | | ||_ _|\ \   / /| ____||  _ \
  _____  _____  / _ \  | |_) || |    | |_| | | |  \ \ / / |  _|  | | | | _____  _____
 |_____||_____|/ ___ \ |  _ < | |___ |  _  | | |   \ V /  | |___ | |_| ||_____||_____|
              /_/   \_\|_| \_\ \____||_| |_||___|   \_/   |_____||____/

```

# Jellyfin Random Button

Adds a "shuffle" button to the Jellyfin header that lets you jump to a random movie or TV show from your library. It's a great way to discover something to watch when you can't decide!

![image](https://github.com/user-attachments/assets/ce373f06-e88e-4033-a05f-2625c962c7c2)

---

## ⚙️ Configuration (Optional)

You can customize which items the random button will pick from.

1.  Open the `randombutton.js` file in a text editor.
2.  Find the `ITEM_TYPES_TO_INCLUDE` variable at the top of the file.
3.  Change its value to one of the following:
    * `'Movie'` - (Default) Only picks random movies.
    * `'Series'` - Only picks random TV shows.
    * `'Movie,Series'` - Picks from both movies and TV shows.

<br>

```javascript
const ITEM_TYPES_TO_INCLUDE = 'Movie';
```
<br>

## 🔧 Installation

### Manual

1. **Locate your Jellyfin web root directory.** <br>
   _You can find the exact path in your Jellyfin server logs._

2. **Open the `index.html` file for editing:**
   ```bash
   sudo nano /usr/share/jellyfin/web/index.html
   ```

3. **Just before the </head> tag, insert this line:**
    ```html
    <script defer src="randombutton.js"></script>
    ```

4. **Download the script directly into your web root using**

   ```bash
   curl -o /usr/share/jellyfin/web/randombutton.js https://raw.githubusercontent.com/n00bcodr/jellyfin-random-button/main/randombutton.js
   ```

   Or copy the contents of the script to a newly created randombutton.js in your webroot

5. **Clear your browser cache** and **reload the Jellyfin web page**.

### Plugin

1. **Install the [Custom JavaScript plugin](https://github.com/johnpc/jellyfin-plugin-custom-javascript)**

2. **Navigate to Dashboard -> Plugins -> Custom JavaScript**

3. **Paste the contents of `randombutton.js` into the textarea**

4. **Restart Jellyfin**

5. **Clear your browser cache** and **reload the Jellyfin web page**.

<br>

> [!NOTE]
> Cross-check your jellyfin web path

<br>

>[!NOTE]
>If your Jellyfin server updates, it may overwrite index.html. If the button disappears after an update, you will need to repeat the above

## 🧪 Tested On

- Jellyfin 10.10.7


## 📜 License

MIT — free to use, modify, share.
