package backend.service;

import backend.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class CustomOAuth2UserService
        implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
    private final UserService userService;

    @Autowired
    public CustomOAuth2UserService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest)
            throws OAuth2AuthenticationException {

        // 1. Fetch raw attributes from Google
        OAuth2User oauth2User = delegate.loadUser(userRequest);

        // 2. Extract the OIDC sub (via spring’s configured name-attribute)
        String googleSub = oauth2User.getName();
        if (googleSub == null || googleSub.isBlank()) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("invalid_user_info"),
                    "Missing required ‘sub’ claim from provider"
            );
        }

        // 3. Grab the email, name, picture from Google’s payload
        String email   = oauth2User.getAttribute("email");
        String name    = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

        // 4. Persist or update your local user
        UserModel user = userService.findOrCreateFromOAuth2(
                googleSub,
                email,
                name,
                picture
        );

        // 5. Build exactly the map your frontend expects:
        Map<String,Object> attrs = new HashMap<>();
        attrs.put("id",          user.getId());
        attrs.put("username",    user.getUsername());
        attrs.put("email",       user.getEmail());
        attrs.put("image",       user.getImage());
        if (user.getGender()     != null) attrs.put("gender",      user.getGender());
        if (user.getMobile()     != null) attrs.put("mobile",      user.getMobile());
        if (user.getDateOfBirth()!= null) attrs.put("dateOfBirth", user.getDateOfBirth());
        if (user.getDescription()!= null) attrs.put("description", user.getDescription());

        // 6. Return a principal whose getAttributes() is *only* that map:
        return new DefaultOAuth2User(
                Set.of(new SimpleGrantedAuthority("ROLE_USER")),
                attrs,
                "id"   // <-- this is the key Spring uses for getName()
        );
    }
}




